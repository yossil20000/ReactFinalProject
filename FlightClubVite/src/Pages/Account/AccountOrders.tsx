
import DataTablePro from '../../Components/DataTablePro';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
function AccountOrders() {
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <>header</>
        </ContainerPageHeader>
        <ContainerPageMain>
          <DataTablePro />
        </ContainerPageMain>
        <ContainerPageFooter>
          <>
            footer
          </>
        </ContainerPageFooter>
      </>

    </ContainerPage>
  )
}

export default AccountOrders
