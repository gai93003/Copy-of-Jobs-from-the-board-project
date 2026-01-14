// src/components/ApplicationInsights/mockApplicationInsights.js

export const MOCK_INSIGHTS = {
  timeframe: "30_days",
  totalApplications: 144,

  stages: [
    {
      id: "applications",
      label: "Applications",
      value: null,                // no % here, just count
      count: 144,
      benchmarks: null,
    },
    {
      id: "initial_screening",
      label: "Initial Screening",
      value: 0.05,                // 20%
      benchmarks: {
        pessimistic: 0.04,
        mean: 0.05,
        optimistic: 0.06,
      },
    },
    // {
    //   id: "hm_screening",
    //   label: "HM Screening",
    //   value: 0.15,                // 15%
    //   benchmarks: {
    //     pessimistic: 0.20,
    //     mean: 0.40,
    //     optimistic: 0.55,
    //   },
    // },
    {
      id: "first_round",
      label: "1st Round",
      value: 0.52,                // 10%
      benchmarks: {
        pessimistic: 0.43,
        mean: 0.62,
        optimistic: 0.80,
      },
    },
    {
      id: "second_round",
      label: "2nd Round",
      value: 0.15,                // 5%
      benchmarks: {
        pessimistic: 0.17,
        mean: 0.26,
        optimistic: 0.38,
      },
    },
    {
      id: "receive_offer",
      label: "Offer",
      value: 0.40,                // 5%
      benchmarks: {
        pessimistic: 0.33,
        mean: 0.42,
        optimistic: 0.50,
      },
    },
    // {
    //   id: "decline",
    //   label: "Declined",
    //   value: 0.70,                // 5%
    //   benchmarks: {
    //     pessimistic: 0.35,
    //     mean: 0.55,
    //     optimistic: 0.75,
    //   },
    // },
  ],

  // Where should we focus? (for mock we pick Initial Screening)
  focusStageId: "initial_screening",
};


// src/components/ApplicationInsights/mockApplicationInsights.js

// import { mapTraineeData } from "../Dashboard/StaffDashboard";

//    const traineeRes = await fetchWithAuth("/staff/cohort/trainees");
//     setTrainees(mapTraineeData(traineeRes.data.rows));
//   }
// export const Data_INSIGHTS = {
//   timeframe: "30_days",
//   totalApplications: 144,

//   stages: [
//     {
//       id: "applications",
//       label: "Applications",
//       value: null,                // no % here, just count
//       count: 144,
//       benchmarks: null,
//     },
//     {
//       id: "initial_screening",
//       label: "Initial Screening",
//       value: 0.05,                // 20%
//       benchmarks: {
//         pessimistic: 0.04,
//         mean: 0.05,
//         optimistic: 0.06,
//       },
//     },
//     // {
//     //   id: "hm_screening",
//     //   label: "HM Screening",
//     //   value: 0.15,                // 15%
//     //   benchmarks: {
//     //     pessimistic: 0.20,
//     //     mean: 0.40,
//     //     optimistic: 0.55,
//     //   },
//     // },
//     {
//       id: "first_round",
//       label: "1st Round",
//       value: 0.52,                // 10%
//       benchmarks: {
//         pessimistic: 0.43,
//         mean: 0.62,
//         optimistic: 0.80,
//       },
//     },
//     {
//       id: "second_round",
//       label: "2nd Round",
//       value: 0.15,                // 5%
//       benchmarks: {
//         pessimistic: 0.17,
//         mean: 0.26,
//         optimistic: 0.38,
//       },
//     },
//     {
//       id: "receive_offer",
//       label: "Offer",
//       value: 0.40,                // 5%
//       benchmarks: {
//         pessimistic: 0.33,
//         mean: 0.42,
//         optimistic: 0.50,
//       },
//     },
//     // {
//     //   id: "decline",
//     //   label: "Declined",
//     //   value: 0.70,                // 5%
//     //   benchmarks: {
//     //     pessimistic: 0.35,
//     //     mean: 0.55,
//     //     optimistic: 0.75,
//     //   },
//     // },
//   ],

//   // Where should we focus? (for mock we pick Initial Screening)
//   focusStageId: "initial_screening",
// };
