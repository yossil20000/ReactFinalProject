
import DataTablePro from '../../Components/DataTablePro';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
function AccountOrdersTab() {
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

export default AccountOrdersTab
