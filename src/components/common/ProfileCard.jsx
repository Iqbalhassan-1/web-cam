import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfileCard = ({ image, firstName, lastName, address,additionalInfo }) => {
    const imageUrl=`http://192.168.1.3:3000/uploads/${image}`
  return (
    <Card className="w-full rounded-2xl overflow-hidden shadow-md border border-gray-200">
      <img
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        className="w-full h-48 object-contain"
      />

      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {firstName} {lastName}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-gray-600">{address}</p>
        <p className="text-sm text-gray-600">{additionalInfo}</p>

        
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
