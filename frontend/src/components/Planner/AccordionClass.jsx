import './Accordion.css'

function AccordionClass({title}) {

  return (
    <div className="accordion-class">
        <span>{title}</span>
        <label class="accordion-class-checkbox">
            <input type="checkbox"></input>
            <span class="checkmark"></span>
        </label>
    </div>
  );
};

export default AccordionClass;