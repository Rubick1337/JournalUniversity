import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import DisciplinesTable from "../../components/DisciplinesTable/DisciplinesTable";



const DisciplinesTablePage = () => {
    return (
        <>
            <Header/>
            <main>
                <DisciplinesTable></DisciplinesTable>
            </main>
            <Footer/>
        </>
    )
}
export default DisciplinesTablePage;