import { useSearchParams } from "next/navigation";

// Dentro de ServiceRequestForm():
const searchParams = useSearchParams();

useEffect(() => {
  const categoryIdParam = searchParams.get("categoryId");
  const descriptionParam = searchParams.get("description");
  const addressParam = searchParams.get("address");
  const neighborhoodParam = searchParams.get("neighborhood");
  const phoneParam = searchParams.get("phone");

  if (
    categoryIdParam ||
    descriptionParam ||
    addressParam ||
    neighborhoodParam ||
    phoneParam
  ) {
    setData((prev) => ({
      ...prev,
      categoryId: categoryIdParam
        ? Number.isNaN(Number(categoryIdParam))
          ? (categoryIdParam as any)
          : Number(categoryIdParam)
        : prev.categoryId,
      description: descriptionParam ?? prev.description,
      address: addressParam ?? prev.address,
      neighborhood: neighborhoodParam ?? prev.neighborhood,
      phone: phoneParam ?? prev.phone,
    }));
  }
}, [searchParams]);