import React, { useEffect, useState } from 'react';
import TableHeader from './tableHeader';
import UserAddModal from './modal/addModal';
import { SuccessModal } from '../componenets/successModal';
import EmailSend from './modal/emailModa';

const UserTable = ({
  globalSearchedTxt,
  fetchClientUsers,
  setIsSearch,
  userFilter,
  data,
}) => {
  const [addOpen, setAddOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success]);
  const handleAddOpen = () => {
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

  const handleEmailOpen = () => {
    setEmailModal(true);
  };
  const handleEmailClose = () => {
    setEmailModal(false);
  };
  return (
    <>
      <TableHeader
        data={data}
        setIsSearch={setIsSearch}
        globalSearchedTxt={globalSearchedTxt}
        userFilter={userFilter}
        handleAddOpen={handleAddOpen}
      />
      {addOpen && (
        <UserAddModal
          fetchClientUsers={fetchClientUsers}
          email={setEmailModal}
          open={addOpen}
          close={handleAddClose}
        />
      )}
      {success && (
        <SuccessModal open={success} close={() => setSuccess(false)} />
      )}
      {emailModal && (
        <EmailSend
          open={emailModal}
          close={handleEmailClose}
          setSuccess={setSuccess}
          text={
            'An email will be sent to user inviting to create a new password'
          }
        />
      )}
    </>
  );
};

export default UserTable;
