import { RootState } from '@/src/redux/store/myStore'
import { useSelector } from 'react-redux'

export const useCurrency = () => {
    const homeCurrency = useSelector(
        (state: RootState) => state.userReducer.user?.currentOrganization?.homeCurrency ?? 'USD'
    )
    return { homeCurrency }
}