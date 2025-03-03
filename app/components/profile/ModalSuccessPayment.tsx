import {
  Button,
  Modal,
} from 'antd';
import Success from '~/assets/success.png';

type ModalSuccessPayment = {
    open: boolean
    onClose: () => void
    newToken: number
}

function ModalSuccessPayment({ onClose, open, newToken}: ModalSuccessPayment) {

    const handleOk = () => {
        onClose()
    }

    return (
        <Modal
            footer={null}
            width={356}
            open={open}
            onClose={onClose}>
            <div className='flex flex-col items-center'>
                <img src={Success} />
                <p className='text-xl mt-5 font-semibold'>Successfull Payment!</p>
                <span className='text-sm mt-[5px] text-gray-500 font-normal text-center '>Your transaction was completed successfully. <br /> Thank you for your purcharse</span>
                <p className='mt-5 text-sm font-normal text-gray-500'>Actual Balance</p>
                <span className='mt-[6px] text-xl font-semibold  text-gray-800'>{newToken?.toFixed(2)} Tokens</span>
                <Button onClick={handleOk} type='primary' className='mt-8 w-full' >OK</Button>
            </div>
        </Modal>
    )
}

export default ModalSuccessPayment
