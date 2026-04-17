import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// shared mapping of sub‑areas -> areas (same as seen in multiple components)
const AREA_MAPPING = {
  'Industry Agnostic': 'Supply Chain Planning',
  'Retail Industry Specific': 'Supply Chain Planning',
  'Consumer Goods Industry Specific': 'Supply Chain Planning'
};

// default fallbacks used across the wizard
const DEFAULT_SUBAREA = 'Industry Agnostic';
const DEFAULT_AREA = 'Supply Chain Planning';

/**
 * Hook that centralises the logic for determining and remembering
 * "functionalArea" and "functionalSubArea" values.
 *
 * Components in the multi‑step wizard can call this hook instead of
 * re‑implementing the same logic every time.
 *
 * It reads initial values from `location.state` (provided by react‑router
 * when the user navigates) and provides helpers to derive a sensible
 * functionalArea if only a sub‑area is known.
 */
export function useFunctionalArea() {
  const location = useLocation();

  // start with whatever the router passed down (or nothing)
  const [functionalSubArea, setFunctionalSubArea] = useState(
    location?.state?.functionalSubArea || DEFAULT_SUBAREA
  );

  // area may come from the API response or we compute it lazily below
  const [functionalArea, setFunctionalArea] = useState(
    location?.state?.functionalArea || ''
  );

  // helper used by components when they receive an API response
  const deriveArea = useCallback(
    (subArea = functionalSubArea) => {
      if (functionalArea) return functionalArea;
      return AREA_MAPPING[subArea] || DEFAULT_AREA;
    },
    [functionalArea, functionalSubArea]
  );

  // whenever sub‑area is updated from outside (e.g. after fetching),
  // recompute area if it was empty.
  useEffect(() => {
    if (!functionalArea && functionalSubArea) {
      setFunctionalArea(deriveArea(functionalSubArea));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionalSubArea]);

  return {
    functionalArea,
    functionalSubArea,
    setFunctionalArea,
    setFunctionalSubArea,
    deriveArea,
    // helper used to build query strings for the backend
    effectiveSubArea: functionalSubArea || DEFAULT_SUBAREA
  };
}
