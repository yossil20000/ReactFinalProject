import React from 'react'
import {useAppDispatch,useAppSelector} from '../../app/hooks'
import {useFetcAllMembersQuery,useFetchBreedsQuery} from '../../features/Users/userSlice'

function MembersPage() {
  const {data: members,isFetching} = useFetcAllMembersQuery();
  const {data: message, isFetching: isFetchingMessage} = useFetchBreedsQuery();
  console.log("Members", members)
  console.log("Messages", message)
  return (
    <div>MembersPage</div>
  )
}

export default MembersPage