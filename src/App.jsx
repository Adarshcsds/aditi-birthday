
import { useState, useRef, useEffect } from 'react'
import './App.css'

const memories = [
  {
    letter: 'A',
    photo: '/photos/a.jpg',
    song: '/music/a.mp3',
    startAt: 75,
    caption: 'A little beginning...',
    note: 'Some people quietly become your favourite part of every day. ❤️',
  },
  {
    letter: 'D',
    photo: '/photos/d.jpg',
    song: '/music/d.mp3',
    startAt: 65,
    caption: 'Days become memories',
    note: 'May every little dream you carry turn into something beautiful.',
  },
  {
    letter: 'I',
    photo: '/photos/i1.jpg',
    song: '/music/i1.mp3',
    startAt: 80,
    caption: 'In every little moment',
    note: 'Keep smiling, keep shining, and never let this world dim your light.',
  },
  {
    letter: 'T',
    photo: '/photos/t.jpg',
    song: '/music/t.mp3',
    startAt: 55,
    caption: 'There is so much ahead',
    note: 'I wish you courage for every challenge and happiness for every new chapter.',
  },
  {
    letter: 'I',
    photo: '/photos/i2.jpg',
    song: '/music/i2.mp3',
    startAt: 70,
    caption: 'It will always be your story',
    note: 'May you become the nursing officer you dream of, a wonderful daughter, and an even happier version of yourself.',
  },
]

const transmissions = [
  {
    code: 'TRANSMISSION_001',
    title: 'THREAT DETECTED',
    message:
      'An unidentified force has been growing more powerful every year. Intelligence reports confirm that the culprit is someone dangerously adorable.',
  },
  {
    code: 'TRANSMISSION_002',
    title: 'AVENGERS DIRECTIVE',
    message:
      'Protect her smile at all costs. It has been classified as a weapon capable of making even the darkest days better.',
  },
  {
    code: 'TRANSMISSION_003',
    title: 'MISSION: HER FUTURE',
    message:
      'She has a dream to become a Nursing Officer. No obstacle, difficult day, or doubt is strong enough to stop her if she keeps believing in herself.',
  },
  {
    code: 'TRANSMISSION_004',
    title: 'FAMILY PROTOCOL',
    message:
      'One day, all her hard work will turn into happiness for her parents. Every sacrifice, every sleepless night, every effort will be worth it.',
  },
  {
    code: 'TRANSMISSION_005',
    title: 'FINAL MESSAGE',
    message:
      'Happy Birthday, Jalebi. The world is a little more beautiful, a little more chaotic, and a lot more worth saving because you are in it.',
  },
]

function App() {
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [musicOn, setMusicOn] = useState(true)
  const [hazardMode, setHazardMode] = useState(false)
  const [hazardSlide, setHazardSlide] = useState(0)

  const audioRef = useRef(null)
  const doomsdayAudioRef = useRef(null)
  const voiceRef = useRef(null)
  const clipTimerRef = useRef(null)

  // Play a short clip for each memory
  useEffect(() => {
    if (!started || hazardMode || !musicOn) {
      if (audioRef.current) audioRef.current.pause()
      return
    }

    const memory = memories[current]
    const audio = audioRef.current

    if (!audio || !memory) return

    clearTimeout(clipTimerRef.current)

    audio.src = memory.song
    audio.currentTime = memory.startAt
    audio.volume = 0.65

    const playClip = async () => {
      try {
        await audio.play()
        clipTimerRef.current = setTimeout(() => {
          audio.pause()
        }, 12000)
      } catch (error) {
        console.log('Music playback blocked by browser.')
      }
    }

    playClip()

    return () => {
      clearTimeout(clipTimerRef.current)
      audio.pause()
    }
  }, [started, current, musicOn, hazardMode])

  // Doomsday soundtrack
  useEffect(() => {
    const audio = doomsdayAudioRef.current
    if (!audio) return

    if (hazardMode && musicOn) {
      audio.volume = 0.55
      audio.loop = true
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }

    return () => audio.pause()
  }, [hazardMode, musicOn])

  // Play voice recording when Doomsday mode activates
  useEffect(() => {
    if (!hazardMode || !voiceRef.current) return

    voiceRef.current.currentTime = 0
    voiceRef.current.volume = 1
    voiceRef.current.play().catch(() => {})
  }, [hazardMode])

  // Reveal birthday content gradually
  useEffect(() => {
    if (!hazardMode) return

    const timer = setInterval(() => {
      setHazardSlide((prev) => (prev < 4 ? prev + 1 : 4))
    }, 5000)

    return () => clearInterval(timer)
  }, [hazardMode])

  const startStory = () => {
    setStarted(true)
    setCurrent(0)
  }

  const nextMemory = () => {
    if (current < memories.length - 1) {
      setCurrent((prev) => prev + 1)
    }
  }

  const replayStory = () => {
    setHazardMode(false)
    setHazardSlide(0)
    setCurrent(0)
    setStarted(true)

    if (doomsdayAudioRef.current) {
      doomsdayAudioRef.current.pause()
      doomsdayAudioRef.current.currentTime = 0
    }

    if (voiceRef.current) {
      voiceRef.current.pause()
      voiceRef.current.currentTime = 0
    }
  }

  const activateHazard = () => {
    setHazardMode(true)
    setHazardSlide(0)

    if (audioRef.current) audioRef.current.pause()
  }

  const toggleMusic = () => {
    setMusicOn((prev) => !prev)
  }

  const memory = memories[current]

  return (
    <main className={hazardMode ? 'birthday-app hazard-active' : 'birthday-app'}>
      <audio ref={audioRef} />
      <audio
        ref={doomsdayAudioRef}
        src="/doomsday/spiderman_3_simbionte.mp3"
      />
      <audio ref={voiceRef} src="/doomsday/voice.mp3" />

      {!started && (
        <section className="intro-screen">
          <div className="intro-content">
            <span className="intro-heart">♥</span>
            <h1>For Aditi</h1>
            <p>A little journey made with love...</p>
            <button className="start-button" onClick={startStory}>
              Start Our Story ✨
            </button>
          </div>
        </section>
      )}

      {started && !hazardMode && (
        <section className="story-screen">
          <div className="story-top">
            <p className="story-label">A LITTLE STORY ABOUT YOU</p>
            <h1>{memory.caption}</h1>
          </div>

          <div className="memory-card">
            <div className="photo-frame">
              <img
                src={memory.photo}
                alt={`Memory ${memory.letter}`}
                className="memory-photo"
              />
            </div>

            <p className="memory-note">{memory.note}</p>
          </div>

          <div className="story-progress">
            {memories.map((memoryItem, index) => (
              <span
                key={index}
                className={`progress-dot ${index === current ? 'active' : ''}`}
              >
                {memoryItem.letter}
              </span>
            ))}
          </div>

          <div className="story-controls">
            <button
              className="music-toggle"
              onClick={toggleMusic}
            >
              {musicOn ? '♫ Music On' : '♫ Music Off'}
            </button>

            {current < memories.length - 1 ? (
              <button className="next-button" onClick={nextMemory}>
                Next Memory →
              </button>
            ) : (
              <button
                className="next-button"
                onClick={activateHazard}
              >
                Continue to the unknown →
              </button>
            )}
          </div>

          <div className="hazard-area">
            <p>Something strange is approaching...</p>
            <button className="hazard-button" onClick={activateHazard}>
              ⚠ DO NOT TOUCH
            </button>
          </div>
        </section>
      )}

      {hazardMode && (
        <section className="doomsday-screen">
          <div className="doomsday-backdrop" />

          <div className="hazard-header">
            <span className="live-indicator">● LIVE TRANSMISSION</span>
            <span className="hazard-code">AVENGERS // CLASSIFIED</span>
          </div>

          <div className="doomsday-content">
            <div className="system-status">
              <p>⚠ SYSTEM BREACH DETECTED ⚠</p>
              <p>UNKNOWN ENTITY HAS ENTERED THE SYSTEM</p>
            </div>

            <h1 className="glitch-title" data-text="DOOMSDAY">
              DOOMSDAY
            </h1>

            <p className="hazard-subtitle">
              THE WORLD MAY END... BUT THIS MESSAGE MUST BE DELIVERED.
            </p>

            {/* Sequential birthday photo reveals */}
            {hazardSlide >= 1 && (
              <div className="birthday-photo-reveal">
                <p className="photo-file-label">FILE_001 // SUBJECT IDENTIFIED</p>
                <img
                  src="/photos/1.jpg"
                  alt="Birthday memory 1"
                  className="hazard-birthday-photo"
                />
                <p className="photo-caption">The reason this mission exists.</p>
              </div>
            )}

            {hazardSlide >= 2 && (
              <div className="birthday-photo-reveal">
                <p className="photo-file-label">FILE_002 // CLASSIFIED</p>
                <img
                  src="/photos/2.jpg"
                  alt="Birthday memory 2"
                  className="hazard-birthday-photo"
                />
                <p className="photo-caption">A smile worth protecting.</p>
              </div>
            )}

            {hazardSlide >= 3 && (
              <div className="birthday-photo-reveal">
                <p className="photo-file-label">FILE_003 // FINAL ARCHIVE</p>
                <img
                  src="/photos/3.jpg"
                  alt="Birthday memory 3"
                  className="hazard-birthday-photo"
                />
                <p className="photo-caption">Our favourite little chaos.</p>
              </div>
            )}

            <div className="classified-notes">
              {transmissions.slice(0, hazardSlide + 1).map((transmission, index) => (
                <article className="hazard-note" key={transmission.code}>
                  <p className="note-code">{transmission.code}</p>
                  <h2>{transmission.title}</h2>
                  <p>{transmission.message}</p>
                </article>
              ))}
            </div>

            {hazardSlide >= 4 && (
              <div className="final-birthday-message">
                <div className="final-glow">✦ ✦ ✦</div>
                <h1>HAPPY BIRTHDAY</h1>
                <h2>JALEBI ❤️</h2>
                <p className="final-quote">
                  In a universe full of chaos, you will always be my favourite
                  little plot twist.
                </p>
                <p className="final-tagline">
                  The world is better with you in it. Never forget that.
                </p>
                <div className="final-glow">✦ ✦ ✦</div>
              </div>
            )}
          </div>

          <div className="hazard-controls">
            <button className="hazard-music-btn" onClick={toggleMusic}>
              {musicOn ? '♫ Sound On' : '♫ Sound Off'}
            </button>

            <button className="reboot-button" onClick={replayStory}>
              ↻ REBOOT TIMELINE
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
