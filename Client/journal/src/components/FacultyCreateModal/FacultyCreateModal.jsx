import PersonSelecter from "../PersonSelecter/PersonSelecter";
import "./FacultyCreateModal.css";
export default function FacultyCreateModal(personData = []) {
  console.log("personData", personData);

  return <PersonSelecter personDataSelect={personData} />;
}
