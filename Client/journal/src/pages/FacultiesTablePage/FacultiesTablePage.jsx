import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FacultiesTable from "../../components/FacultiesTable/FacultiesTable";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getAllFaculties } from "../../store/slices/facultySlice";

const FacultiesTablePage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllFaculties());
  }, [dispatch]);
  return (
    <>
      <Header />
      <main>
        <FacultiesTable></FacultiesTable>
      </main>
      <Footer />
    </>
  );
};
export default FacultiesTablePage;
