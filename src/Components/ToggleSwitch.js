import "../componentStyles/ToggleSwitch.css";
  
const ToggleSwitch = ({ label, searchBy}) => {
  return (
    <div className="container">
      {}{" "}
        <div className="toggle-switch">
            <input type="checkbox" className="checkbox" 
                  name={label} id={label} onChange={searchBy}/>
            <label className="label" htmlFor={label} >
                <span className="inner" />
                <span className="switch" />
            </label>
        </div>
    </div>
  );
};
  
export default ToggleSwitch;