import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SpecializationListTable from "../../components/SpecializationList/Specialization";



const SpecilizationTablePage = () => {
    return (
        <>
            <Header/>
            <main>
                <SpecializationListTable/>
            </main>
            <Footer/>
        </>
    )
}
export default SpecilizationTablePage;