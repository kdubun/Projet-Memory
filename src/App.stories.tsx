import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const meta: Meta<typeof App> = {
  title: 'App/Shell',
  component: App,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof App>

export const Default: Story = {}

