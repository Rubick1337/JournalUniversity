import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FacultiesTable from "../../components/FacultiesTable/FacultiesTable";



const FacultiesTablePage = () => {
    return (
        <>
            <Header/>
            <main>
               <FacultiesTable></FacultiesTable>
            </main>
            <Footer/>
        </>
    )
}
export default FacultiesTablePage;