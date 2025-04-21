import React from 'react'
import Events from './events'
import Users from './users'
import TaskIcon from './TaskIcon'
import WorkflowIcon from './WorkflowIcon'
import ServiceCategoriesIcon from './ServiceCategoriesIcon'
import ServicesIcon from './ServicesIcon'
import AddOnsIcon from './AddOnsIcon'
import FileList from './FileList'
import RuleIcon from './RuleIcon'

const getMenuIcon = ({ path, color }) => {
  switch (true) {
    case path?.includes('events'):
      return <Events color={color} />
    case path?.includes('users'):
      return <Users color={color} />
    case path?.includes('task'):
      return <TaskIcon color={color} />
    case path?.includes('workflows'):
      return <WorkflowIcon color={color} />
    case path?.includes('categories'):
      return <ServiceCategoriesIcon color={color} />
    case path?.includes('services'):
      return <ServicesIcon color={color} />
    case path?.includes('add-ons'):
      return <AddOnsIcon color={color} />
    case path?.includes('staff'):
      return <Users color={color} />
    case path?.includes('file-list'):
      return <FileList color={color} />
    case path?.includes('rule'):
      return <RuleIcon color={color} />
    default:
      return null
  }
}

export default getMenuIcon
