import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { CSSProperties } from 'styled-components';

const thumbsContainer: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 4,
  width: '100%',
  justifyContent: 'center',
};

const thumb: CSSProperties = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  width: 150,
  height: 200,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img: CSSProperties = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

const baseStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const activeStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

interface IProps {
  defaultImage?: undefined | string;
  handleUpload(file: File): void;
}

interface IFile {
  preview: string;
  file: File | null;
  progress?: number;
  error?: boolean;
  url: string;
}

const Uploader: React.FC<IProps> = ({ defaultImage, handleUpload }) => {
  const [files, setFiles] = useState([] as IFile[]);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    maxSize: 1048576,
    onDrop: (acceptedFiles: any) => {
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          }),
        ),
      );
      handleUpload(acceptedFiles[0]);
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept],
  );

  const fileRejectionItems = fileRejections.map(
    ({ file, errors }: { file: any; errors: any }) => (
      <>
        {/* {file.path} - {file.size} bytes */}
        <ul key={file.path}>
          {errors.forEach((e: any): JSX.Element | undefined => {
            if (e.code === 'file-too-large') {
              return <li key={e.code}>Tamanho máximo de 1MB</li>;
            }
            if (e.code === 'file-invalid-type') {
              return <li key={e.code}>Tipos válidos: jpeg, jpg, png</li>;
            }
            return undefined;
          })}
        </ul>
      </>
    ),
  );

  return (
    <section className="container">
      <aside style={thumbsContainer}>
        <div style={thumb}>
          <div style={thumbInner}>
            <img
              src={files.length > 0 ? files[0].preview : defaultImage}
              style={img}
              alt="preview"
            />
          </div>
        </div>
      </aside>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Arraste e solte o arquivo aqui, ou clique para selecionar!</p>
        <div style={{ color: 'red' }}>{fileRejectionItems}</div>
      </div>
    </section>
  );
};

export default Uploader;
