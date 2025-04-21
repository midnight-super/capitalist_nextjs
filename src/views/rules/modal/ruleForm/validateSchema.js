import * as Yup from 'yup'

export const ruleValidationSchema = Yup.object().shape({
  ruleName: Yup.string().trim().required('Rule Name is required'),
  selectedObject: Yup.object()
    .shape({
      objectId: Yup.string().required('Object ID is required'),
      objectName: Yup.string().required('Object Name is required'),
    })
    .required('Please select an object'),
  selectedEvent: Yup.object()
    .shape({
      eventId: Yup.string().required('Event ID is required'),
      eventName: Yup.string().required('Event Name is required'),
    })
    .required('Please select an event'),
  selectedQueryActions: Yup.array().of(
    Yup.object().shape({
      actionId: Yup.string().required(),
      actionName: Yup.string().required(),
    })
  ),
  selectedMutationActions: Yup.array()
    .of(
      Yup.object().shape({
        actionId: Yup.string().required(),
        actionName: Yup.string().required(),
      })
    )
    .min(1, 'At least one mutation action must be selected'),
  status: Yup.string().oneOf(['ACTIVE', 'INACTIVE'], 'Invalid status').required('Status is required'),
})
