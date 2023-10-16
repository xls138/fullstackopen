import React from "react";

const PersonForm = ({
  newName,
  newNumber,
  addPerson,
  handlePersonChange,
  handleNumberChange,
}) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit" onClick={addPerson}>
          add
        </button>
      </div>
    </form>
  );
};

export default PersonForm;
