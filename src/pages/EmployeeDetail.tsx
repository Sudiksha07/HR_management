const EmployeeDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get employee ID from URL params
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [user] = useAuthState(auth); // Ensure 'auth' is correctly initialized
  
    useEffect(() => {
      const fetchEmployee = async () => {
        try {
          if (!user) return; // Check if user is authenticated
          const docRef = doc(db, 'users', user.uid, 'employees', id); // Replace 'users' with your Firestore collection name
          const docSnap: DocumentSnapshot<Employee> = await getDoc(docRef);
  
          if (docSnap.exists()) {
            setEmployee({ id: docSnap.id, ...docSnap.data()! });
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching employee:', error);
        }
      };
  
      fetchEmployee();
    }, [id, user]);
  
    if (!employee) {
      return <div>Loading employee details...</div>;
    }
  
    return (
      <div>
        <h2>Employee Details</h2>
        <p>Name: {employee.name}</p>
        <p>Email: {employee.email}</p>
        <p>Phone Number: {employee.phoneNumber}</p>
        <p>Gender: {employee.gender}</p>
        <p>Department: {employee.department}</p>
        <p>Role: {employee.role}</p>
      </div>
    );
  };
  
  export default EmployeeDetail;
  
  