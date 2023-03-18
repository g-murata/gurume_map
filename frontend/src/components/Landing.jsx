export const Landing = () => {
  return (
    <>
      <div className="max-w-screen-2xl px-4 md:px-8 mx-auto">
        <div className="flex items-center flex-col"> 
          <img src={`${process.env.PUBLIC_URL}/GurumeMap.jpg`} className="md:w-2/4" alt="GurumeMap" />
          <img src={`${process.env.PUBLIC_URL}/HowToUse.jpg`} className="md:w-2/4" alt="HowToUse" />
        </div>
          <div className="flex items-center flex-col md:flex-row">
            <img src={`${process.env.PUBLIC_URL}/HowToUse_1.jpg`} className="md:w-2/4" alt="HowToUse_1" />
            <img src={`${process.env.PUBLIC_URL}/HowToUse_2.jpg`} className="md:w-2/4" alt="HowToUse_2" />
          </div>
      </div>
    </>
  )
}
