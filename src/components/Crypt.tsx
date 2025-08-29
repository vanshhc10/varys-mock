import { useState, useEffect, useRef } from 'react'
import { Upload, FolderPlus, X, Check, HardDrive, Cloud } from 'lucide-react'
import './Crypt.css'

const Crypt: React.FC = () => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [showUploadDropdown, setShowUploadDropdown] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [folderName, setFolderName] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string
    name: string
    size: number
    type: string
    uploadDate: Date
    status: 'uploaded' | 'processing' | 'error'
  }>>([])
  const [createdFolders, setCreatedFolders] = useState<Array<{
    id: string
    name: string
    createDate: Date
    status: 'created' | 'error'
  }>>([])
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const uploadCardRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uploadCardRef.current && !uploadCardRef.current.contains(event.target as Node)) {
        setShowUploadDropdown(false)
      }
    }

    if (showUploadDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUploadDropdown])

  // Close file/folder dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null)
      }
    }

    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdownId])

  const handleUploadFiles = () => {
    setShowUploadDropdown(!showUploadDropdown)
  }

  const handleDeviceUpload = () => {
    setShowUploadDropdown(false)
    setShowUploadModal(true)
  }

  const handleGoogleDriveUpload = () => {
    setShowUploadDropdown(false)
    // Handle Google Drive integration
    console.log('Google Drive upload clicked')
    alert('Google Drive integration coming soon!')
  }

  const handleCreateFolder = () => {
    setShowFolderModal(true)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files)
      setSelectedFiles(filesArray)
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    // Simulate upload completion
    setTimeout(() => {
      setIsUploading(false)
      setShowUploadModal(false)

      // Add uploaded files to the list
      const newFiles = selectedFiles.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type || 'unknown',
        uploadDate: new Date(),
        status: 'uploaded' as const
      }))

      setUploadedFiles(prev => [...prev, ...newFiles])
      setSelectedFiles([])
      setUploadProgress(0)
    }, 500)
  }

  const handleFolderCreation = () => {
    if (folderName.trim()) {
      // Simulate folder creation
      setTimeout(() => {
        setShowFolderModal(false)

        // Add created folder to the list
        const newFolder = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: folderName,
          createDate: new Date(),
          status: 'created' as const
        }

        setCreatedFolders(prev => [...prev, newFolder])
        setFolderName('')
      }, 500)
    }
  }

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
    setOpenDropdownId(null)
  }

  const handleRemoveFolder = (folderId: string) => {
    setCreatedFolders(prev => prev.filter(folder => folder.id !== folderId))
    setOpenDropdownId(null)
  }

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  return (
    <div className="crypt-container">
      <div className="crypt-header">
        <h1 className="crypt-title">Crypt</h1>
        <p className="crypt-subtitle">Safely store your documents</p>
      </div>

      <div className="crypt-content">
        <div className="action-cards">
          <div className="action-card" onClick={handleUploadFiles} ref={uploadCardRef}>
            <div className="card-icon">
              <Upload size={20} />
            </div>
            <span className="card-text">Upload Files</span>

            {/* Upload Dropdown Menu */}
            {showUploadDropdown && (
              <div className="upload-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="dropdown-item" onClick={handleDeviceUpload}>
                  <HardDrive size={16} />
                  <span>From Device</span>
                </div>
                <div className="dropdown-item" onClick={handleGoogleDriveUpload}>
                  <Cloud size={16} />
                  <span>From Google Drive</span>
                </div>
              </div>
            )}
          </div>

          <div className="action-card" onClick={handleCreateFolder}>
            <div className="card-icon">
              <FolderPlus size={20} />
            </div>
            <span className="card-text">Create Folder</span>
          </div>
        </div>

        {/* Your Files & Folders Section */}
        {(uploadedFiles.length > 0 || createdFolders.length > 0) && (
          <div className="files-folders-section">
            <h2 className="section-title">Your files & folders</h2>

            {/* Files & Folders Table */}
            {(uploadedFiles.length > 0 || createdFolders.length > 0) && (
              <div className="files-folders-table">
                <div className="table-header">
                  <div className="header-cell">Name</div>
                  <div className="header-cell">Format</div>
                  <div className="header-cell">Status</div>
                  <div className="header-cell"></div>
                </div>

                <div className="table-body">
                  {/* Folders */}
                  {createdFolders.map((folder) => (
                    <div key={folder.id} className="table-row">
                      <div className="table-cell name-cell">
                        <div className="expand-arrow">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9,18 15,12 9,6"></polyline>
                          </svg>
                        </div>
                        <div className="folder-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </div>
                        <span className="item-name">{folder.name}</span>
                      </div>
                      <div className="table-cell">
                        <span className="format-badge">FOLDER</span>
                      </div>
                      <div className="table-cell">Updated on {folder.createDate.toLocaleDateString()}</div>
                      <div className="table-cell">
                        <div className="dropdown-container" ref={dropdownRef}>
                          <button
                            className="more-options-btn"
                            onClick={() => toggleDropdown(folder.id)}
                            title="More options"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                          {openDropdownId === folder.id && (
                            <div className="options-dropdown">
                              <div className="dropdown-option" onClick={() => handleRemoveFolder(folder.id)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                <span>Remove folder</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Files */}
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="table-row">
                      <div className="table-cell name-cell">
                        <div className="expand-arrow">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9,18 15,12 9,6"></polyline>
                          </svg>
                        </div>
                        <div className="file-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                          </svg>
                        </div>
                        <span className="item-name">{file.name}</span>
                      </div>
                      <div className="table-cell">
                        <span className="format-badge">{file.type.toUpperCase()}</span>
                      </div>
                      <div className="table-cell">Updated on {file.uploadDate.toLocaleDateString()}</div>
                      <div className="table-cell">
                        <div className="dropdown-container" ref={dropdownRef}>
                          <button
                            className="more-options-btn"
                            onClick={() => toggleDropdown(file.id)}
                            title="More options"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="1"></circle>
                              <circle cx="19" cy="12" r="1"></circle>
                              <circle cx="5" cy="12" r="1"></circle>
                            </svg>
                          </button>
                          {openDropdownId === file.id && (
                            <div className="options-dropdown">
                              <div className="dropdown-option" onClick={() => handleRemoveFile(file.id)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                <span>Remove file</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Files Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Upload Files</h3>
              <button className="close-btn" onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="file-upload-area">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept="*/*"
                  className="file-input"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <Upload size={24} />
                  <span>Click to select files or drag and drop</span>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files:</h4>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                    ))}
                  </ul>
                </div>
              )}

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span>{uploadProgress}%</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowUploadModal(false)}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="modal-overlay" onClick={() => setShowFolderModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Folder</h3>
              <button className="close-btn" onClick={() => setShowFolderModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="input-group">
                <label htmlFor="folder-name">Folder Name:</label>
                <input
                  type="text"
                  id="folder-name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="folder-input"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowFolderModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleFolderCreation}
                disabled={!folderName.trim()}
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Crypt
