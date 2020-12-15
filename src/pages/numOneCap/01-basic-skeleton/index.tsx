import React, { useEffect } from 'react'
import * as THREE from 'three'

const BasicSkeleton = () => {

  const init = () => {
    console.log(`Using Three.js version: ${THREE.REVISION}`)
  }

  useEffect(() => {
    init()
  }, [])

	return (
		<div>
			基本骨架
		</div>
	)
}

export default BasicSkeleton