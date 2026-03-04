'use client'

import dynamic from 'next/dynamic'

const WriteCapsule = dynamic(() => import('../../components/WriteCapsule'), { ssr: false })

export default function WritePage() {
  return <WriteCapsule />
}
