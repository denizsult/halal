import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse } from "axios";

type MockResponse = {
  status: number;
  data: unknown;
};

const commonsData = {
  brands: [
    { id: 1, name: "Toyota", slug: "toyota", logo_url: null },
    { id: 2, name: "Honda", slug: "honda", logo_url: null },
  ],
  models: [
    { id: 10, brand_id: 1, name: "Corolla", slug: "corolla" },
    { id: 11, brand_id: 1, name: "Camry", slug: "camry" },
  ],
  countries: [
    { id: 34, name: "Turkey", code: "TR", phone_code: "+90" },
    { id: 1, name: "United States", code: "US", phone_code: "+1" },
  ],
  cities: [
    { id: 1, country_id: 34, name: "Istanbul", slug: "istanbul" },
    { id: 2, country_id: 34, name: "Ankara", slug: "ankara" },
  ],
  features: [
    { id: 1, name: "Bluetooth", slug: "bluetooth", icon: "bluetooth" },
    { id: 2, name: "GPS", slug: "gps", icon: "gps" },
    { id: 3, name: "Air Conditioning", slug: "ac", icon: "ac" },
  ],
};

const emptyListings = {
  data: [],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  },
  links: {
    first: "",
    last: "",
    prev: null,
    next: null,
  },
};

const toAxiosResponse = (
  config: AxiosRequestConfig,
  response: MockResponse
): AxiosResponse => ({
  config: config as AxiosRequestConfig,
  data: response.data,
  status: response.status,
  statusText: response.status === 200 ? "OK" : "Mocked",
  headers: {},
});

const handleMock = (config: AxiosRequestConfig): MockResponse | null => {
  const method = (config.method || "get").toLowerCase();
  const base = config.baseURL || "";
  const url = new URL(config.url || "", base);
  const path = url.pathname;

  if (method === "get" && path === "/v1/commons/brands") {
    return {
      status: 200,
      data: { success: true, data: commonsData.brands },
    };
  }

  if (method === "get" && /\/v1\/commons\/brands\/\d+\/models$/.test(path)) {
    return {
      status: 200,
      data: { success: true, data: commonsData.models },
    };
  }

  if (method === "get" && path === "/v1/commons/countries") {
    return {
      status: 200,
      data: { success: true, data: commonsData.countries },
    };
  }

  if (method === "get" && /\/v1\/commons\/countries\/\d+\/cities$/.test(path)) {
    return {
      status: 200,
      data: { success: true, data: commonsData.cities },
    };
  }

  if (method === "get" && path === "/v1/commons/features") {
    return {
      status: 200,
      data: { success: true, data: commonsData.features },
    };
  }

  if (path === "/v1/rent-a-car/listings") {
    if (method === "post") {
      return {
        status: 200,
        data: { data: { id: 101 } },
      };
    }
    if (method === "get") {
      return {
        status: 200,
        data: emptyListings,
      };
    }
  }

  if (
    method === "post" &&
    /\/v1\/rent-a-car\/listings\/\d+\/images$/.test(path)
  ) {
    return { status: 200, data: { success: true } };
  }

  if (
    method === "post" &&
    /\/v1\/rent-a-car\/listings\/\d+\/availability$/.test(path)
  ) {
    return { status: 200, data: { success: true } };
  }

  if (
    method === "put" &&
    /\/v1\/rent-a-car\/listings\/\d+\/pricing$/.test(path)
  ) {
    return { status: 200, data: { success: true } };
  }

  if (
    method === "put" &&
    /\/v1\/rent-a-car\/listings\/\d+\/terms$/.test(path)
  ) {
    return { status: 200, data: { success: true } };
  }

  if (path === "/api/proxy/api/main/extranet/hospitals/add") {
    if (method === "post") {
      return {
        status: 200,
        data: { success: true, data: { id: 201 } },
      };
    }
  }

  if (path === "/api/proxy/api/main/extranet/hospitals") {
    if (method === "get") {
      return {
        status: 200,
        data: {
          success: true,
          data: [
            {
              id: 201,
              name: "Mock Hospital",
              description: "Mock description",
              mission: "Mock mission",
              vision: "Mock vision",
            },
          ],
        },
      };
    }
  }

  if (path === "/api/proxy/api/main/extranet/hospitals/update") {
    if (method === "put") {
      return { status: 200, data: { success: true } };
    }
  }

  if (path === "/api/proxy/api/main/extranet/hospitals/delete") {
    if (method === "delete") {
      return { status: 200, data: { success: true } };
    }
  }

  if (path === "/api/proxy/api/main/extranet/hospitals/media/upload") {
    if (method === "post") {
      return { status: 200, data: { success: true } };
    }
  }

  if (
    method === "get" &&
    /\/api\/proxy\/api\/main\/extranet\/hospitals\/\d+$/.test(path)
  ) {
    return {
      status: 200,
      data: {
        success: true,
        data: {
          id: 201,
          name: "Mock Hospital",
          description: "Mock description",
          mission: "Mock mission",
          vision: "Mock vision",
        },
      },
    };
  }

  return null;
};

export const createMockAdapter =
  (fallbackAdapter: AxiosAdapter): AxiosAdapter =>
  async (config) => {
    const mockResponse = handleMock(config);
    if (mockResponse) {
      return toAxiosResponse(config, mockResponse);
    }
    return fallbackAdapter(config);
  };
