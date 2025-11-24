import { useState, useEffect } from 'react'
import { database } from './firebase'
import { ref, onValue, runTransaction } from 'firebase/database'

function Survey() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [responses, setResponses] = useState({
    cocktailBar: 0,
    champagneOnly: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const responsesRef = ref(database, 'responses')

    const unsubscribe = onValue(responsesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setResponses(data)
      } else {
        setResponses({
          cocktailBar: 0,
          champagneOnly: 0
        })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedOption) {
      const responseRef = ref(database, `responses/${selectedOption}`)

      try {
        await runTransaction(responseRef, (currentValue) => {
          return (currentValue || 0) + 1
        })
        setSubmitted(true)
      } catch (error) {
        console.error('Error submitting response:', error)
        alert('Failed to submit response. Please try again.')
      }
    }
  }

  const handleReset = () => {
    setSelectedOption(null)
    setSubmitted(false)
  }

  const totalResponses = responses.cocktailBar + responses.champagneOnly

  if (loading) {
    return (
      <div className="survey-container">
        <div className="survey-card">
          <h1 className="survey-title">🎄 Christmas Party Survey 🎄</h1>
          <p style={{ textAlign: 'center', color: '#4a5568' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="survey-container">
      <div className="survey-card">
        <h1 className="survey-title">🎄 Christmas Party Survey 🎄</h1>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <p className="survey-question">What would you prefer for the Christmas party?</p>

            <div className="options-container">
              <label className={`option-card ${selectedOption === 'cocktailBar' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="preference"
                  value="cocktailBar"
                  checked={selectedOption === 'cocktailBar'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-icon">🍸</span>
                  <span className="option-text">Small Cocktail Bar & Champagne</span>
                </div>
              </label>

              <label className={`option-card ${selectedOption === 'champagneOnly' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="preference"
                  value="champagneOnly"
                  checked={selectedOption === 'champagneOnly'}
                  onChange={(e) => setSelectedOption(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-icon">🥂</span>
                  <span className="option-text">Just Champagne Only</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={!selectedOption}
            >
              Submit Response
            </button>
          </form>
        ) : (
          <div className="thank-you">
            <h2>Thank you for your response! 🎉</h2>
            <p className="confirmation">
              You selected: <strong>
                {selectedOption === 'cocktailBar' ? 'Small Cocktail Bar & Champagne' : 'Just Champagne Only'}
              </strong>
            </p>

            <div className="results">
              <h3>Current Results:</h3>
              <div className="result-item">
                <span className="result-label">🍸 Cocktail Bar & Champagne:</span>
                <span className="result-count">{responses.cocktailBar}</span>
                <span className="result-percentage">
                  {totalResponses > 0 ? `(${Math.round((responses.cocktailBar / totalResponses) * 100)}%)` : '(0%)'}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">🥂 Champagne Only:</span>
                <span className="result-count">{responses.champagneOnly}</span>
                <span className="result-percentage">
                  {totalResponses > 0 ? `(${Math.round((responses.champagneOnly / totalResponses) * 100)}%)` : '(0%)'}
                </span>
              </div>
              <div className="total-responses">
                Total responses: {totalResponses}
              </div>
            </div>

            <button onClick={handleReset} className="reset-button">
              Submit Another Response
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Survey
