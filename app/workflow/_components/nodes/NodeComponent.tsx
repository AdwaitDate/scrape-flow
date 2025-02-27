import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "@/app/workflow/_components/nodes/NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNodes";

const NodeComponent = memo((props: NodeProps) => {
const nodeData =props.data as AppNodeData;
    return (
        <NodeCard nodeId={props.id} isSelected={!!props.selected} > 
        <NodeHeader taskType ={nodeData.type}/>
         </NodeCard>
    );
});

NodeComponent.displayName = "NodeComponent";

export default NodeComponent;
