import { StudioProvider } from '@/components/studio/studio-provider'
import { StudioShell } from '@/components/studio/studio-shell'

export default function Page() {
  return (
    <StudioProvider>
      <StudioShell />
    </StudioProvider>
  )
}
