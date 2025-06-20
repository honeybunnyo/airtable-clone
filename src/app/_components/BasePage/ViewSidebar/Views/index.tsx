import View from "./View"

const Views = () => {
  return (
    <div className="flex flex-col mt-2">
      <View selected={true}/>
      <View selected={false}/>
      <View selected={false}/>


    </div>
  )
}

export default Views