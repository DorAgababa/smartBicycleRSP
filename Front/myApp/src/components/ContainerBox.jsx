
const ContainerBox = ({ children , color,Centered,sx={}}) => {

  return (
    <div className="ContainerBox" style={{ backgroundColor: color, height: '100dvh', width: '100dvw' ,
    display: Centered ? 'flex' : '',
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
    maxWidth:'800px',
    position:"relative",
    ...sx
    }}>
      {children}
    </div>
  );
};

export default ContainerBox;
