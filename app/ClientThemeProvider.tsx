import { ThemeProvider } from "next-themes"

const ClientThemeProvider = ({ children }) => {
  return (
    <ThemeProvider attribute="class" enableSystem={true}>
      {children}
    </ThemeProvider>
  )
}

export default ClientThemeProvider

