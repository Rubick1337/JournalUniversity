import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import AssessmentTypesTable from "../../components/AssesmentType/AssesmentTypeTable";



const TypeAssesmentPage = () => {
    return (
        <>
            <Header/>
            <main>
                <AssessmentTypesTable/>
            </main>
            <Footer/>
        </>
    )
}
export default TypeAssesmentPage;