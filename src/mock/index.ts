import type { MockMethod } from 'vite-plugin-mock'
import userMock from './user'
import courseMock from './course'
import assignmentMock from './assignment'
import gradeMock from './grade'
import studentMock from './student'
import classMock from './class'

const mockModules: MockMethod[] = [
  ...userMock,
  ...courseMock,
  ...assignmentMock,
  ...gradeMock,
  ...studentMock,
  ...classMock
]

export default mockModules
