import { NavigationBar } from '../components/NavigationBar'
type BaseProps = {
  children: React.ReactNode
}
export default function Base({ children }: BaseProps) {
  return (
    <>
      <NavigationBar />
      {children}
      {/*% include 'movies/movie-detail-modal.html' % */}
    </>
  )
}
