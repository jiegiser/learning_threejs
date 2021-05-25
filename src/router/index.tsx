import React from 'react'
import {HashRouter, Route, Switch} from 'react-router-dom'
import BasicSkeleton from '../pages/numOneCap/01-basic-skeleton'
import FirstScene from '../pages/numOneCap/02-first-scene'
import MeshLine from '../pages/MeshLine'


const BasicRoute = () => (
  <HashRouter>
    <Switch>
      <Route exact path="/" component={BasicSkeleton}/>
      <Route exact path="/first-scene" component={FirstScene}/>
      <Route exact path="/MeshLine" component={MeshLine} />
    </Switch>
  </HashRouter>
)
export default BasicRoute