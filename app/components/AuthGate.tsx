import AuthGateClient from './AuthGateClient'

export default function AuthGate({ topicTitle }: { topicTitle: string }) {
  return <AuthGateClient topicTitle={topicTitle} />
}
