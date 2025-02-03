import { PropsWithChildren } from "react"

const Layout = ({ children }: PropsWithChildren) => {
  return <div className="m-1.5 flex-1 md:m-2 lg:m-2.5">{children}</div>
}

export default Layout
