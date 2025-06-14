
import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

type Step = "category" | "subcategory" | "results";

interface JobSearchBreadcrumbsProps {
  currentStep: Step;
  selectedCategory?: { id: string; name: string } | null;
  selectedSubcategories?: string[];
  onStepChange: (step: Step) => void;
}

const JobSearchBreadcrumbs: React.FC<JobSearchBreadcrumbsProps> = ({
  currentStep,
  selectedCategory,
  selectedSubcategories,
  onStepChange
}) => {
  return (
    <Breadcrumb className="mb-2">
      <BreadcrumbList>
        {/* Category step */}
        <BreadcrumbItem>
          {currentStep === "category" ? (
            <BreadcrumbPage>Category</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <button onClick={() => onStepChange("category")}>Category</button>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {/* Subcategory step */}
        {(currentStep === "subcategory" || currentStep === "results") && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {currentStep === "subcategory" ? (
                <BreadcrumbPage>
                  {selectedCategory ? selectedCategory.name : "Subcategory"}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <button onClick={() => onStepChange("subcategory")}>
                    {selectedCategory ? selectedCategory.name : "Subcategory"}
                  </button>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        )}

        {/* Results Step */}
        {currentStep === "results" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                Results
                {selectedSubcategories && selectedSubcategories.length > 0 ? (
                  <> ({selectedSubcategories.length})</>
                ) : null}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default JobSearchBreadcrumbs;
