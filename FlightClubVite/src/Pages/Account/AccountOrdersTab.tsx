
import OrderTable from '../../Components/OrderTable';
import ContainerPage, { ContainerPageHeader, ContainerPageMain, ContainerPageFooter } from '../Layout/Container';
function AccountOrdersTab() {
  return (
    <ContainerPage>
      <>
        <ContainerPageHeader>
          <>header</>
        </ContainerPageHeader>
        <ContainerPageMain>
          <OrderTable />
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
