import React, { ReactNode } from "react";

interface ApiDocLayoutProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
}

const ApiDocLayout: React.FC<ApiDocLayoutProps> = ({
  leftContent,
  rightContent,
}) => {
   return (
     <div className="min-h-screen mx-auto max-w-7xl">
       <div className="flex flex-col lg:flex-row gap-8">
         {" "}
         {/* Use flex */}
         <div className="prose max-w-none lg:w-1/2 flex-grow">
           {" "}
           {/* flex-grow for left */}
           {leftContent}
         </div>
         <div className="relative lg:w-1/2 hidden lg:block">
           {" "}
           {/* Right side */}
           <div className="sticky top-8 overflow-auto rounded-lg p-8 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
             {rightContent}
           </div>
         </div>
         <div className="lg:hidden p-8 rounded-lg">{rightContent}</div>
       </div>
     </div>
   );
};

export default ApiDocLayout;
