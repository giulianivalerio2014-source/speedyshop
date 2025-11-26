
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const CreditIcon: React.FC<{ size?: string }> = ({ size = "w-4 h-4" }) => {
  return (
    <div className={`inline-block align-middle ${size} mx-1`}>
      <div className="w-full h-full transform rotate-45 bg-gradient-to-tr from-red-500 via-yellow-400 via-green-500 via-blue-500 to-purple-500 shadow-[0_0_10px_rgba(255,255,255,0.4)] animate-pulse" />
    </div>
  );
};

export default CreditIcon;
