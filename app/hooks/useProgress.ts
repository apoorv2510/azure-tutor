'use client'
import { useState, useEffect } from 'react'

type Progress = Record<string, 'studied' | 'quizzed' | 'mastered'>

const KEY = 'azure-tutor-progress'

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      if (saved) setProgress(JSON.parse(saved))
    } catch {}
  }, [])

  const markProgress = (topicId: string, status: 'studied' | 'quizzed' | 'mastered') => {
    setProgress((prev) => {
      const next = { ...prev, [topicId]: status }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  const getStatus = (topicId: string) => progress[topicId] ?? null

  const totalTopics = 11 // 6 AZ-900 + 5 AZ-104
  const studied = Object.values(progress).filter(Boolean).length

  return { progress, markProgress, getStatus, studied, totalTopics }
}
