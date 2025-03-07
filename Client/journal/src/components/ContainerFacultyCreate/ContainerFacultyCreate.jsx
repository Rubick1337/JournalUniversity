import FacultyCreateModal from '../FacultyCreateModal/FacultyCreateModal'
import './ContainerFacultyCreate.css'
import { createPerson } from "../../store/slices/personSlice";
import { useState } from "react";
import { useSelector } from "react-redux";


export default function ContainerFacultyCreate() {
    const { data, isLoading } = useSelector((state) => state.person.personsDataForSelect);
    console.log("data",data);
    return (
        <>
        <FacultyCreateModal personData = {data}/>
        </>
    )
}