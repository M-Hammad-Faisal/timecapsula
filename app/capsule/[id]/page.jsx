'use client'

import dynamic from 'next/dynamic'

const CapsulePreview = dynamic(() => import('../../../components/CapsulePreview'), { ssr: false })

export default function CapsulePage() {
  return <CapsulePreview />
}
