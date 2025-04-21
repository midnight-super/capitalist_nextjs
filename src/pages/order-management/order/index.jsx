import { Box, Button, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import FilesSection from './components/FilesSection';
import OrderInformation from './components/OrderInformation';
import Sidebar from './components/Sidebar';
import PreviewFile from './components/PreviewFile';

const CreateOrder = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [filesByTab, setFilesByTab] = useState({
    general: [],
  });
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('general');
  const [previewFile, setPreviewFile] = useState(null);
  const [orderParts, setOrderParts] = useState([]);

  // workflow---
  const [isTask, setIsTask] = useState(null);

  const handlePartStepChange = (partId, step) => {
    setOrderParts(
      orderParts.map((part) =>
        part.id === partId ? { ...part, steps: step } : part
      )
    );
  };

  useEffect(() => {
    setPreviewFile(null);
  }, [activeTab]);

  const showConfigureWorkflow = filesByTab.general.length > 0;

  const handlePreview = (file) => {
    setPreviewFile(file);
  };


  const handleCreateOrderPart = () => {
    const existingNames = orderParts.map((part) => part.name);
    let baseName = "Untitled";
    let newName = baseName;
    let count = 0;

    while (existingNames.includes(newName)) {
      count++;
      newName = `${baseName} (${count})`;
    }

    const randomNumber = Math.floor(10000000 + Math.random() * 90000000)

    const newOrderPart = {
      id: `order-part-${randomNumber}`,
      name: newName,
      steps: null,
      isOpen: true,
    };

    setOrderParts([...orderParts, newOrderPart]);
    setFilesByTab((prev) => ({
      ...prev,
      [newOrderPart.id]: [],
    }));
    setActiveTab(newOrderPart.id);
  };


  const handleFilesUploaded = (completedFiles) => {
    const newFiles = completedFiles.map((file) => ({
      file,
      name: file.name,
      size: `${Math.round(file.size / 1024)}KB`,
    }));

    setFilesByTab((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), ...newFiles],
    }));
  };

  const handleOrderPartNameChange = (orderId, newName) => {
    setOrderParts(
      orderParts.map((part) =>
        part.id === orderId ? { ...part, name: newName } : part
      )
    );
  };

  const handleMoveFilesToOrderPart = (partId) => {
    const selectedFileIndices = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([index]) => Number(index));

    const filesToMove = selectedFileIndices.map(
      (index) => filesByTab.general[index]
    );

    setFilesByTab((prev) => ({
      ...prev,
      [partId]: [...(prev[partId] || []), ...filesToMove],
      general: prev.general.filter(
        (_, index) => !selectedFileIndices.includes(index)
      ),
    }));
    setCheckedItems({});
  };

  const handleMoveFilesToGeneral = (fromTabId) => {
    const selectedFileIndices = Object.entries(checkedItems)
      .filter(([_, isChecked]) => isChecked)
      .map(([index]) => Number(index));

    const filesToMove = selectedFileIndices.map(
      (index) => filesByTab[fromTabId][index]
    );

    const uniqueFilesToMove = filesToMove.filter(
      (fileToMove) =>
        !filesByTab.general.some(
          (existingFile) =>
            existingFile.name === fileToMove.name &&
            existingFile.size === fileToMove.size
        )
    );

    setFilesByTab((prev) => ({
      ...prev,
      general: [...prev.general, ...uniqueFilesToMove],
      [fromTabId]: prev[fromTabId].filter(
        (_, index) => !selectedFileIndices.includes(index)
      ),
    }));
    setCheckedItems({});
  };

  const handleMakeFileVisibleAgain = (fileToMakeCopy) => {
    setFilesByTab((prev) => ({
      ...prev,
      general: [...prev.general, fileToMakeCopy],
    }));
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showConfigureWorkflow={showConfigureWorkflow}
        orderParts={orderParts}
        setOrderParts={setOrderParts}
        onPartStepChange={handlePartStepChange}
        setIsTask={setIsTask}
        isTask={isTask}
        setPreviewFile={setPreviewFile}
        setFilesByTab={setFilesByTab}
      />

      <Box sx={{ flex: 1 }}>
        <Box sx={{ px: 3 }}>
          <Grid
            container
            spacing={3}
            sx={{ '& > .MuiGrid-item': { display: 'flex' } }}
          >
            <Grid item xs={5}>
              <Box
                sx={{
                  bgcolor: '#fff',
                  py:
                    filesByTab[activeTab]?.length > 0 ||
                      uploadingFiles.length > 0
                      ? '30px'
                      : '0',
                  borderRadius: 1,
                  border:
                    filesByTab[activeTab]?.length > 0 ||
                      uploadingFiles.length > 0
                      ? '0.5px solid #DADCE0'
                      : 'none',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <FilesSection
                  checkedItems={checkedItems}
                  setCheckedItems={setCheckedItems}
                  files={filesByTab[activeTab] || []}
                  setFiles={(newFiles) => {
                    setFilesByTab((prev) => ({
                      ...prev,
                      [activeTab]: newFiles,
                    }));
                  }}
                  uploadingFiles={uploadingFiles}
                  setUploadingFiles={setUploadingFiles}
                  activeTab={activeTab}
                  onPreview={handlePreview}
                  setPreviewFile={setPreviewFile}
                  onCreateOrderPart={handleCreateOrderPart}
                  orderParts={orderParts}
                  onFilesUploaded={handleFilesUploaded}
                  onMoveFilesToOrderPart={handleMoveFilesToOrderPart}
                  onMoveFilesToGeneral={handleMoveFilesToGeneral}
                  filesByTab={filesByTab}
                  onMakeFileVisibleAgain={handleMakeFileVisibleAgain}
                  previewFile={previewFile}
                />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box
                sx={{
                  bgcolor: '#fff',
                  p: '30px',
                  borderRadius: 1,
                  border: '0.5px solid #DADCE0',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: "670px",
                  overflow: "auto",
                }}
              >
                {previewFile ? (
                  <PreviewFile
                    file={previewFile}
                    onClose={() => setPreviewFile(null)}
                  />
                ) : (
                  <OrderInformation
                    activeTab={activeTab}
                    orderParts={orderParts}
                    onOrderPartNameChange={handleOrderPartNameChange}
                    setOrderParts={setOrderParts}
                    isTask={isTask}
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                textTransform: 'capitalize',
                bgcolor: '#4489FE',
                border: '1px solid #4489FE',
                borderRadius: '4px',
                padding: '10px 40px',
              }}
            >
              Submit Order
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateOrder;
