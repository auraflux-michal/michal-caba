declare namespace App {
  interface Locals {
    /** The page renders the home-page sections, so section links stay in-page (`#id`) */
    homeSections?: boolean;
    /** The page includes the offer module: the INDEX menu lists it after "Buduję" */
    offerSection?: boolean;
    /** Copy version for the home sections (src/data/copy.ts); defaults to v1 (live) */
    copy?: import('@/data/copy').SiteCopy;
  }
}
