import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import { FormData } from "@/lib/protocols/types";

// Form Actions
type FormAction =
  | { type: "UPDATE_FIELD"; field: keyof FormData; value: any }
  | { type: "UPDATE_MULTIPLE"; updates: Partial<FormData> }
  | { type: "RESET_FORM" }
  | { type: "SET_FORM_DATA"; data: FormData };

// Form State
interface FormState {
  data: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  isDirty: boolean;
}

// Form Context
interface FormContextType {
  state: FormState;
  updateField: (field: keyof FormData, value: any) => void;
  updateMultiple: (updates: Partial<FormData>) => void;
  setError: (field: keyof FormData, error: string) => void;
  clearError: (field: keyof FormData) => void;
  validateForm: () => boolean;
  resetForm: () => void;
  hasAnyData: () => boolean;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Form Reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        data: {
          ...state.data,
          [action.field]: action.value,
        },
        isDirty: true,
        // Clear error when field is updated
        errors: {
          ...state.errors,
          [action.field]: undefined,
        },
      };

    case "UPDATE_MULTIPLE":
      return {
        ...state,
        data: {
          ...state.data,
          ...action.updates,
        },
        isDirty: true,
      };

    case "RESET_FORM":
      return {
        data: {},
        errors: {},
        isDirty: false,
      };

    case "SET_FORM_DATA":
      return {
        ...state,
        data: action.data,
        isDirty: true,
      };

    default:
      return state;
  }
}

// Initial state
const initialState: FormState = {
  data: {},
  errors: {},
  isDirty: false,
};

// Form Provider
interface FormProviderProps {
  children: React.ReactNode;
  initialData?: Partial<FormData>;
}

export function FormProvider({
  children,
  initialData = {},
}: FormProviderProps) {
  const [state, dispatch] = useReducer(formReducer, {
    ...initialState,
    data: initialData,
  });

  const updateField = useCallback((field: keyof FormData, value: any) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  }, []);

  const updateMultiple = useCallback((updates: Partial<FormData>) => {
    dispatch({ type: "UPDATE_MULTIPLE", updates });
  }, []);

  const setError = useCallback((field: keyof FormData, error: string) => {
    // This would be handled by a separate error action in a full implementation
    console.warn("Error setting not implemented in this simplified version");
  }, []);

  const clearError = useCallback((field: keyof FormData) => {
    // This would be handled by a separate error action in a full implementation
    console.warn("Error clearing not implemented in this simplified version");
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Required field validations
    if (!state.data.ageGroup) {
      newErrors.ageGroup = "Please select your age group";
    }

    if (
      !state.data.currentVO2Max ||
      state.data.currentVO2Max < 10 ||
      state.data.currentVO2Max > 90
    ) {
      newErrors.currentVO2Max = "VO2Max must be between 10 and 90 ml/kg/min";
    }

    if (!state.data.activityLevel) {
      newErrors.activityLevel = "Please select your activity level";
    }

    // Update errors in state (in a real implementation)
    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      console.warn("Form validation errors:", newErrors);
    }

    return isValid;
  }, [state.data]);

  const resetForm = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  const hasAnyData = useCallback((): boolean => {
    return !!(
      state.data.ageGroup ||
      state.data.sex ||
      state.data.height ||
      state.data.weight ||
      state.data.currentVO2Max ||
      state.data.vo2maxKnown ||
      state.data.activityLevel ||
      state.data.healthConditions?.length ||
      state.data.medications?.length ||
      state.data.timeAvailability ||
      state.data.equipmentAccess ||
      state.data.primaryGoal ||
      state.data.restingHeartRate
    );
  }, [state.data]);

  const contextValue: FormContextType = {
    state,
    updateField,
    updateMultiple,
    setError,
    clearError,
    validateForm,
    resetForm,
    hasAnyData,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
}

// Custom hook to use form context
export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
}

// Custom hook for form field
export function useFormField<T extends keyof FormData>(field: T) {
  const { state, updateField } = useForm();

  return {
    value: state.data[field],
    error: state.errors[field],
    onChange: (value: FormData[T]) => updateField(field, value),
  };
}
