import React from 'react';
import FileSingle from './FileSingle';
type DisplayFrontProps = {
    files: string[];
};

const DisplayFront: React.FC<DisplayFrontProps> = ({ files }) => {
    if (files.length === 0) {
        return <p>No files to display</p>;
    }

    return (
        <div className="flex flex-col items-center gap-4 mt-4 mb-4">

            {files.map((file, index) => (
                <div key={index} className="flex flex-col items-center">
                    <audio preload='auto' controls>
                        <source src={file} type={file.endsWith('.wav') ? 'audio/wav' : 'audio/mpeg'} />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ))}
        </div>
    );
};

export default DisplayFront;

