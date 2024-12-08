type props = {
  text: string
}

export const AppAnimatedTitle = ({text}: props) => {
  return (
    <h2 className="font-general text-sm md:text-md font-medium uppercase tracking-wide mb-10">
      {text}
    </h2>
  )
}